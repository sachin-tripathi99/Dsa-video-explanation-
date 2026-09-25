class WordDictionary {
    struct Node {
        Node* children[26] = {};
        bool isEnd = false;
    };
    Node* root = new Node();

    bool dfs(Node* node, const string& p, size_t i) {
        if (i == p.size()) return node->isEnd;
        if (p[i] == '.') {
            for (Node* child : node->children)
                if (child && dfs(child, p, i + 1)) return true;   // try every branch
            return false;
        }
        Node* child = node->children[p[i] - 'a'];
        return child && dfs(child, p, i + 1);
    }
public:
    WordDictionary() {}

    void addWord(string word) {
        Node* node = root;
        for (char ch : word) {
            int i = ch - 'a';
            if (!node->children[i]) node->children[i] = new Node();
            node = node->children[i];
        }
        node->isEnd = true;
    }

    bool search(string word) {
        return dfs(root, word, 0);
    }
};
