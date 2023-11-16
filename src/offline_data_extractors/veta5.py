import os
import glob

from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime

from collections import OrderedDict

from src.study_defs import *



def veta5_data_parser(input_data_path):
    assert os.path.exists(input_data_path)

    html_data = None

    with open(input_data_path,"r") as html_source:
        html_data = html_source.readlines()

    soup = BeautifulSoup("\n".join(html_data),"html.parser")


    # find javascript part
    rawJ = soup.find_all("script")

    J = str(rawJ[0])

    # extract machine id
    id_script = J.split('var T_Data0 = ["')
    raw_id_info = id_script[1].split(",];")[0].replace("<br>"," ").split('","')
    
    machine_type = raw_id_info[1]
    machine_id = raw_id_info[3]
    machine_mac = raw_id_info[5]

    location = veta5_location_dict.get(str(machine_id))
    location = "unknown" if location not in locations else location
    
    
    # extract data
    data_script = J.split('var T_Data3 = ["') 
    raw_df = data_script[1].split(",];")[0].replace("<br>"," ")
    cells = raw_df.split('","')
    N = len(cells)
    n_col = 7
    n_row = N // n_col

    (n_row,n_col)

    _data = {}

    for i in range(n_col):
        idx = i*n_row
        _data[cells[idx]] = []
        for j in range(1,n_row):
            _data[cells[idx]].append(cells[idx+j])

    df = pd.DataFrame(_data)
    
    cols = df.columns.tolist()
    df["End Case"] = df["Date Time Event"].apply(lambda x: "End Case" in str(x))
    df["Date Time Event"] = df["Date Time Event"].apply(lambda x: datetime.strptime(str(x).replace("End Case",""),"%Y-%m-%d %H:%M "))

    case_end_rows = df[df["End Case"]== True]
    case_ends = case_end_rows.sort_values(by="Date Time Event")["Date Time Event"].tolist()
    
    case_list = []
    for ce in case_ends:
        _df = df[df["Date Time Event"]<=ce]
        df = df.drop(_df.index)
        _df = _df.reset_index(drop=True)[1:].sort_values(by="Date Time Event").reset_index(drop=True)

        start_time = _df["Date Time Event"].min()
        end_time = _df["Date Time Event"].max()
        
        if len(_df.index) == 0:
            continue
        
        case_info = OrderedDict(start_time = start_time,
                                end_time = end_time,
                                location = location,
                                data = _df[cols])
                
        case_list.append(case_info)

    return case_list



if __name__ == "__main__":
    sample_path_mask = "/nas/medicopus_share/Projects/ExamLogger/new_test_data/RAW/VETA5/*/VETA5_*_Service.html"
    
    for sample_path in glob.glob(sample_path_mask):
        print(sample_path)
        try:
            cases = veta5_data_parser(sample_path)
            for c in cases:
                print(f"Case at {c.get('location')} from {c.get('start_time')} to {c.get('end_time')}")
        except Exception as exc:
            print(exc)