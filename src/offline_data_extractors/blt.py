import os, sys, glob
from collections import OrderedDict


import re

import pandas as pd

import tabula

from src.study_defs import *


def __blt_retro_pdf_data_extract_single_page__(pdf_path,
                                       page = 1,
                                       table_count = 1,
                                       metadata_rows = 2, data_start_row = 5, data_end_row = -1,
                                       colnames = None,
                                       verbose = False,
                                       datetime_regex=r'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})'):
    
    assert os.path.exists(pdf_path)
    tabula_tables = tabula.read_pdf(pdf_path, pages = page)
    
    if len(tabula_tables) < table_count:
        return
    
    try:
        taula_table = tabula_tables[0]
        
        if isinstance(colnames,type(None)):
            tabula_raw_cols = taula_table[metadata_rows:data_start_row]
            #print(tabula_raw_cols)
            parsed_cols = []

            for c in list(tabula_raw_cols.columns):   
                data = tabula_raw_cols[c].tolist()
                data = [str(d) for d in data if not pd.isna(d)]
                data = "".join(data)
                for d in data.split(" "):
                    if d == "":
                        continue
                    parsed_cols.append(d)

            if verbose:
                print("Columns parsed")

            #print(parsed_cols)
        else:
            parsed_cols = list(colnames)
        #print(parsed_cols)
        
        # parse dataframe
        
        df = taula_table[data_start_row:data_end_row].reset_index(drop=True)

        if len(df.columns.tolist()) != parsed_cols:
            # split columns on space                
            _df = pd.DataFrame()
            new_col_index = 0
            time_col_found = False
            for c in df.columns.tolist():
                if(df[c].apply(lambda x: pd.isna(x)).all()):
                    continue
                #print(c)
                try:
                    if not time_col_found:
                        _col = df[c].apply(lambda x: str(re.sub(' +', ' ',str(x))))
                        _col1 = _col.apply(lambda x: str(re.search(datetime_regex,x).group(1)))
                        _col2 = _col.apply(lambda x: str(re.sub(datetime_regex,"",x)))
                        if _col2.apply(lambda x: x=="").all():
                            _df[c] = _col1
                        else:
                            _df=_df.assign(**{f"{c}1":_col1,f"{c}2":_col2})
                                                
                        time_col_found = True
                        continue
                    
                except Exception as e:
                    print(e)
                    pass
                
                if df[c].apply(lambda x: " " in str(x).strip()).all():
                    _col = df[c].apply(lambda x: str(re.sub(' +', ' ',str(x))).strip().replace(" / ","/").replace("( ","(").replace(" )",")"))

                    # --- / --- sometimes contains spaces
                    if (_col.apply(lambda x: not isinstance(re.search(r"(\S+ \/ \S+)",x),type(None))).all()):
                        _df[c] = _col.apply(lambda x: str(x).replace(" / ","/"))
                    else:
                        df_extraction = _col.str.split(' ', expand=True)
                        df_extraction.columns = [c+str(i) for i in df_extraction.columns]
                        _df = pd.concat([_df, df_extraction], axis=1)
                else:
                    _df[c] = df[c]                        
            df = _df
         
        assert(len(df.columns.tolist()) == len(parsed_cols))
        df.columns = parsed_cols
        time_col = df[df.columns.tolist()[0]]
        start_time = time_col.min()
        end_time = time_col.max()
        
        if verbose:
            print("Dataframe parsed")
        
        # parse metadata
        metadata_dict = {}
        if metadata_rows > 0:
            metadata_rows = taula_table[:metadata_rows]
            
            metadata_candidates = []
            metadata_candidates.extend(metadata_rows.columns.tolist())
            for index, row in metadata_rows.iterrows():
                metadata_candidates.extend(row.tolist())

            #print(metadata_rows)

            for mc in metadata_candidates:
                if pd.isna(mc):
                    continue
                if "Unnamed" in mc:
                    continue
                mc_data = str(mc).replace(": ","#").split(" ")
                for _ in mc_data:
                    _mc_data = _.split("#")
                    metadata_dict[_mc_data[0]] = " ".join(_mc_data[1:]).strip()

            
            
            if verbose:
                print("Metadata parsed")
        
        location = blt_location_dict.get(metadata_dict.get("szoba"))
        location = "unknown" if location not in locations else location
        
        
        res = OrderedDict(start_time = start_time,
                          end_time = end_time,
                          location = location,
                          metadata = metadata_dict,data =df) 
        return res
        
    except Exception as ex:
        print(ex)
    

    

def blt_data_parser(input_data_path):
    default_cols = ['idő', 'HR(BPM)', 'PR(BPM)', 'SpO2(%)', 'RR(RPM)', 'NIBP(mmHg)']
    all_cols = ["idő",'HR(BPM)', 'PR(BPM)', 'SpO2(%)', 'RR(RPM)', "TD", "TEMP1", 'NIBP(mmHg)',"ART","EtCO2(mmHg)/FiCO2(mmHg)"]
    
    res = None
    for cols in [default_cols,all_cols,None]:
        try:
            res = __blt_retro_pdf_data_extract_single_page__(pdf_path=input_data_path, colnames=cols )
            if not isinstance(res,type(None)):
                return res
        except Exception as e:
            print("Unable to parse data")
    return res
    
    
if __name__ == "__main__":
    sample_path_mask = "/nas/medicopus_share/Projects/ExamLogger/new_test_data/RAW/BLT/*.pdf"
    # sample_path_mask = "/nas/medicopus_share/Projects/ExamLogger/new_test_data/RAW/BLT/kira.pdf"
    
    for sample_path in glob.glob(sample_path_mask):
        print(sample_path)
        try:
            case = blt_data_parser(sample_path)
            if isinstance(case,type(None)):
                continue
            print(f"Case at {case.get('location')} from {case.get('start_time')} to {case.get('end_time')}")
            print(case.get('metadata'))
        except Exception as exc:
            print(exc)