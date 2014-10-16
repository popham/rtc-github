@0xca1d81d050b655e3;

using import "user.capnp".Uid;
using import "user.capnp".User;

enum MediaIdentifier {
    data @0;
    audio @1;
    video @2;
}

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
        ice @6 :Ice;
    }

    struct Ice {
        candidate @0 :Text;
        sdpMLineIndex @1 :UInt16;
        sdpMId @2 :MediaIdentifier;
    }
}
