class Trie {
    struct Node {
        Node* children[26] = {};
        bool isEnd = false;
    };
    Node* root = new Node();

    Node* walk(const string& s) {
        Node* node = root;
        for (char ch : s) {
            node = node->children[ch - 'a'];
            if (!node) return nullptr;
        }
        return node;
    }
public:
    Trie() {}

    void insert(string word) {
        Node* node = root;
        for (char ch : word) {
            int i = ch - 'a';
            if (!node->children[i]) node->children[i] = new Node();
            node = node->children[i];
        }
        node->isEnd = true;
    }

    bool search(string word) {
        Node* node = walk(word);
        return node && node->isEnd;
    }

    bool startsWith(string prefix) {
        return walk(prefix) != nullptr;
    }
};
