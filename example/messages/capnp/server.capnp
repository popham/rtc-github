@0xc6c0baeb8ceae645;

using import "/user.capnp".User;

struct Server {
    messages @0 :List(Message);

    struct Message {
        source @0 :User;
        value @1 :Text;
    }
}
