@0xf1debd61db8d2044;

using import "user.capnp".User;

struct Server {
    sessionId @0 :Data;
    offers @1 :List(User);
}
