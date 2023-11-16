import os


study_root_folder = "/nas/medicoups_shared/Project/ExamLogger/"

subdir = "new_test_data"

raw_dir = os.path.join(study_root_folder,subdir,"RAW")

processed_dir = os.path.join(study_root_folder,subdir,"PROCESSED")

index_dir = os.path.join(study_root_folder,subdir,"INDEX")

report_dir = os.path.join(study_root_folder,subdir,"INDEX")

machines = ["VETA5","BLT"]

locations = ["angio","muto"]

veta5_location_dict = {"15103146990030":"muto", "15103146990097":"angio"}

blt_location_dict = {"Műtő":"muto","Muto":"muto","muto":"muto",
                     "Angio":"angio","angio":"angio"}