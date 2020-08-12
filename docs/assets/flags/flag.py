from os import listdir
from os.path import isfile, join
mypath = './'
onlyfiles = [f"{f.split('.')[0]}" for f in listdir(
    mypath) if isfile(join(mypath, f)) and f != 'flag.py']
print(onlyfiles)


# for f in listdir(mypath):
#     if isfile(join(mypath, f)) and f != 'flag.py':
#         print(f"insert into flags (iso) values ('{f.split('.')[0]}');")
