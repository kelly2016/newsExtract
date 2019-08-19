#-*- coding=utf-8 -*-
import pymysql
import re
import jieba
import langconv
import platform
import os

host = 'rm-8vbwj6507z6465505ro.mysql.zhangbei.rds.aliyuncs.com'
port = 3306
user = 'root'
password = 'AI@2019@ai'
charset = 'utf8'
db = 'stu_db'
table_name = 'news_student'

#�д�֮�󱣴��ļ�λ�ã����޸ģ�������Ҫ�������Ŀ¼
sysStr = platform.system()
if sysStr == 'Windows':
	cutFileName = 'D:\python\datasource\project/news_cut.txt'
elif sysStr == 'Linux':
	cutFileName = 'news_cut.txt'

if not os.path.exists(cutFileName):
	os.mknod(cutFileName)
	
#�������ݿ⣬ȡ�����ݣ�����ת������ϴ���дʲ�����
def getDBNews():
	conn = pymysql.Connect(host=host,port=port,user=user,password=password,charset=charset,db=db)
	if not conn: return False
	cursor = conn.cursor()
	result = cursor.execute("select * from news_chinese")
	results = cursor.fetchall()
	fileNews = open(cutFileName,'w', encoding = 'utf8')

	for rs in results:
		l = []
		if not rs[3]: continue
		news = rs[3].strip()
		if not news: continue
		text = "".join(re.findall(r'[\d|\w]+',news))#������ϴ
		text = langconv.Converter('zh-hans').convert(text)#����ת��
		cut_text = list(jieba.cut(text))#�д�
		for term in cut_text:
			l.append(term)
		fileNews.write(" ".join(l) + '\n')
	fileNews.close()    
	conn.close()
	return True

#�����д�֮���news
def getCutNews():	
	newsContent = []
	with open(cutFileName, 'r', encoding ='utf8') as f:
		for line in f:
			line = line.strip()
			if not line: continue
			newsContent.append(line)
	return newsContent

def getNews():
	print('Loading file ... ')
	newsContent = getCutNews()
	if len(newsContent) > 0:
		print('Loading file Successfull ... ')
		return newsContent
	print('Loading fill failed, try to load from database ...')
	print('Getting data from database, please wait for a moment ...')
	if not getDBNews():
		print("Database not available")
		return None
	print('Loading file ... ')
	newsContent = getCutNews()
	print('Loading file Successfull ... ')
	return newsContent

if __name__ == '__main__':
	newsContent = getNews()	
	print('length of news:' + str(len(newsContent)))
