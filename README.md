# Golang - Google Remote Procedure Call (GRPC)

Berikut adalah simple tutorial implementasi `GRPC` menggunakan `golang` sebagai **services** `(GRPC SERVER)` dan `nodejs` sebagai **gateway** `(GRPC CLIENT)`. Tutorial yang saya buat ini mirip seperti internal project saya pribadi, namun project pribadi saya lebih kompleks dari pada ini dan banyak tools juga yang digunakan contoh seperti `consul`, `rabbitmq`, `redis` etc. dan ada beberapa juga penerapan pattern seperti `circuit braker`, `bg worker` etc, karena tujuan tutorial ini saya buat hanya untuk bagaimana caranya menggunakan `GRPC` di `golang` jadi saya buat simple saja agar mudah di mengerti juga untuk teman - teman semua khusus nya yang baru belajar.

## Multiple Proto Service

Jika anda mempunyai multiple service di `proto schema` anda, seperti `proto schema` dibawah ini, anda bisa membuat struktur folder nya menjadi seperti gambar berikut ini, untuk memudahkan memanage code yang dibuat, di group sesuain dengan fiture nya masing - masing, sesuai dengan pengelompokan service di `proto schema`.

- ![](https://i.imgur.com/DtCmZvV.png)

- ```proto
  syntax = "proto3";
  package question;

  option go_package = "./question";

  import "google/protobuf/any.proto";
  import "google/protobuf/empty.proto";

  message Response {
    int32  stat_code = 1;
    string stat_message = 2;
    string err_code = 3;
    string err_message = 4;
    google.protobuf.Any data = 5;
    google.protobuf.Any pagination = 6;
  }

  /**
  =====================================
  = QUESTION DAO METHOD TERITORY
  =====================================
  **/

  message CreatedDTO {
    string name = 1;
  }

  message FindByIdDTO {
    string id = 1;
  }

  message UpdatedByIdDTO {
    string id = 1;
    string name = 2;
  }

  service QuestionService {
    rpc Created (stream CreatedDTO) returns (Response) {}
    rpc FindAll (stream google.protobuf.Empty) returns (Response) {}
    rpc FindById (stream FindByIdDTO) returns (Response) {}
    rpc UpdatedById (stream UpdatedByIdDTO) returns (Response) {}
  }

  /**
  =====================================
  = QUESTION USER DAO METHOD TERITORY
  =====================================
  **/

  message SetAnswer {
    string questionId = 1;
    string answer = 2;
  }

  message SetAnswerDTO {
    string id = 1;
    repeated SetAnswer questions = 2;
  }

  message VerifiedAnswer {
    string questionId = 1;
    string answer = 2;
  }

  message VerifiedAnswerDTO {
    string id = 1;
    repeated VerifiedAnswer questions = 2;
  }

  message ChangeAnswer {
    string questionId = 1;
    string answer = 2;
  }

  message ChangeAnswerDTO {
    string id = 1;
    repeated ChangeAnswer oldquestions = 2;
    repeated ChangeAnswer questions = 3;
  }

  service QuestionUserSecurityService {
    rpc SetAnswer (stream SetAnswerDTO) returns (Response) {}
    rpc VerifiedAnswer (stream VerifiedAnswerDTO) returns (Response) {}
    rpc ChangeAnswer (stream ChangeAnswerDTO) returns (Response) {}
  }
  ```

## Connect With Me

- [GitHub](https://github.com/restuwahyu13)
- [Instagram]( https://www.instagram.com/restuvh705)
- [Facebook](https://www.facebook.com/restuvanhalen)
- [Linkedin](https://www.linkedin.com/in/restuwahyu13)

## Other Tutorial

- [Basic GRPC](https://github.com/restuwahyu13/node-grpc)
- [Go GRPC Gateway](https://github.com/restuwahyu13/go-grpc-gateway)
- [Express GRPC](https://github.com/restuwahyu13/express-grpc-rest-api)
- [GRPC Typescript Config](https://github.com/restuwahyu13/grpc-typescript-config)# golang-grpc
