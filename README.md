- saya masih bingung apakah error handling termaksud kedalam bussiness logic, sehingga ragu apakah saya memasukan error handling ke dalam concrete repository. 
- juga, dalam hal ini untuk reply apakah tidak apa jika dijadikan satu tabel dengan comment? 
- lalu untuk concrete repository, dalam melakukan query select apakah harus selalu direturn sebagai object entitas?

- Kemudian pada pengujian postman `[Optional] Get Replied Thread After Johndoe Reply Deleted` terdapat kesalahan dimana untuk reply pertama content tersebut seharusnya milik reply kedua.

```js
// sebelumperbaikan
const [reply1, reply2] = comment.replies;
...
pm.expect(reply1.content).to.equal('**balasan telah dihapus**');
pm.expect(reply1.date).to.be.a('string');
pm.expect(reply1.date).to.not.equal('');
pm.expect(reply1.username).to.equal(pm.environment.get('newUsername'));
...
pm.expect(reply2.content).to.equal(pm.environment.get('newReplyContent'));
pm.expect(reply2.date).to.be.a('string');
pm.expect(reply2.date).to.not.equal('');
pm.expect(reply2.username).to.equal(pm.environment.get('newUsername2'));
// setelah perbaikan
const [reply1, reply2] = comment.replies;
...
pm.expect(reply1.content).to.equal(pm.environment.get('newReplyContent'));
pm.expect(reply1.date).to.be.a('string');
pm.expect(reply1.date).to.not.equal('');
pm.expect(reply1.username).to.equal(pm.environment.get('newUsername'));
...
pm.expect(reply2.content).to.equal('**balasan telah dihapus**');
pm.expect(reply2.date).to.be.a('string');
pm.expect(reply2.date).to.not.equal('');
pm.expect(reply2.username).to.equal(pm.environment.get('newUsername2'));
```
- Lalu, untuk penyjian integration testing menggunakan JWT apakah terdapat referensi yang mencontohkan implementasinya? karna dokumentasi cukup tidak membantu