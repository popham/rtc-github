@0xf1debd61db8d2044;

using import "user.capnp".User;
using import "peer.capnp".Peer;

const emptyHostsUpdate :List(User) = [];

struct Server {
    union {
        session :group {
            user @0 :User;
        }
        hostsUpdate @1 :List(User);
        peer @2 :Peer;
    }
}
