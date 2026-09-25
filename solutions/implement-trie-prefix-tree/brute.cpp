class Trie {
    vector<string> words;
public:
    Trie() {}

    void insert(string word) { words.push_back(word); }

    bool search(string word) {
        for (auto& w : words) if (w == word) return true;
        return false;
    }

    bool startsWith(string prefix) {
        for (auto& w : words) if (w.compare(0, prefix.size(), prefix) == 0) return true;
        return false;
    }
};
