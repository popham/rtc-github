@0xcb410f8429d6fbc6;

using import "peer.capnp".Peer;

struct Client {
    union {
        service :group {
            isOffering @0 :Bool;
        }
        peer @1 :Peer;
    }
}
