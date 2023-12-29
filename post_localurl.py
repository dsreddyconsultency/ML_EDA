import tornado.httpserver
import tornado.ioloop
from tornado import websocket, web
import tornado.web
import ssl
import json
import pandas as pd
from io import StringIO
import os

cl=[]
class SocketHandler(websocket.WebSocketHandler):
    def drop_object_columns(self,df):
        non_object_columns = df.select_dtypes(exclude='object').columns
        return df[non_object_columns]

    
    def check_origin(self, origin):
        return True

    def open(self):
        self.df=pd.DataFrame()
        pass
    def on_message(self, message):
#        print(f"recived{message}") 
#       if message:
#        file_info = self.request.files.get('fileInput')
#        original_filename = file_info['filename']
#        print(file_info[0])
#        file_content = file_info['body'].decode('utf-8')
#        file_obj=StringIO(file_content)


#        file_obj=self.request.files.get('fileInput',[])[0]['body']
    #    print(message)
    #    print(file_content)
        mess1=json.loads(message)
        if 'csvData' in mess1:
           mess=mess1['csvData']
           mess2=StringIO(mess)
           if mess.startswith(','):
              df=pd.read_csv(mess2,index=False)
           else:
              df=pd.read_csv(mess2)   
      #  mess1=mess['csvData']
           
#           print(mess)
            
           
 #          print(df.head())
           df_non_obj=self.drop_object_columns(df)
           csv_string=df_non_obj.to_csv(index=False)
   #        print(df.to_csv())
           dsr={'csvData':df.to_csv(index=False).rstrip('\n')}
           self.write_message(dsr)
         #  print(df.head(25))
           del df
#        pass
  
    def on_close(self):
        pass

class AdminHandler(web.RequestHandler):
    def get(self):
        pass
    def post(self):
        pass







class IndexHandler(web.RequestHandler):
    def get(self):
        self.render("index.html")
    def post(self):
        pass



class getToken(tornado.web.RequestHandler):
    def drop_object_columns(self,df):
        non_object_columns = df.select_dtypes(exclude='object').columns
        return df[non_object_columns]

    def post(self):
        file_info = self.request.files.get('fileInput')[0]
#        original_filename = file_info['filename']
        file_content = file_info['body'].decode('utf-8')
        file_obj=StringIO(file_content)
    #    print(file_content)
        df=pd.read_csv(file_obj)
        df_non_obj=self.drop_object_columns(df)
        csv_string=df_non_obj.to_csv(index=False)
        self.write(csv_string)



application = tornado.web.Application([
    (r'/upload', getToken),
    (r'/ws', SocketHandler),
    (r'/index', IndexHandler),
    (r'/Admin',AdminHandler),
    (r"/static/(.*)", tornado.web.StaticFileHandler, {"path": os.path.join(os.path.dirname(__file__), "static")}), 
])

if __name__ == '__main__':
     ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
     ssl_context.load_cert_chain(certfile="../cert/server.crt", keyfile="../cert/server.key")
     ssl_context.load_verify_locations(cafile="../cert/ca_chain.crt")
     http_server = tornado.httpserver.HTTPServer(application,ssl_options=ssl_context)
     http_server.listen(9889)
     tornado.ioloop.IOLoop.instance().start()
