@0xca1d81d050b655e3;

using import "user.capnp".Uid;
using import "user.capnp".User;

struct Peer {
    source :union {
        unset @0 :Void;
        user @1 :User;
    }
    target :union {
        unset @2 :Void;
        userId @3 :Uid;
    }
    union {
        offer :group {
            sdp @4 :Text;
        }
        answer :group {
            sdp @5 :Text;
        }
        iceCandidate @6 :Text;
    }
}
