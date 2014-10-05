@0xcb410f8429d6fbc6;

using import "user.capnp".Uid;

struct Client {
    union {
        signaller :group {
            # Signaller communication
            initialSessionId @0 :Data;
        }
        service :group {
            # Self state
            offer @1 :Bool;
        }
        peer :union {
            # Peer communication
            offer :group {
                target @2 :Uid;
            }
            answer :group {
                target @3 :Uid;
            }
        }
    }
}
