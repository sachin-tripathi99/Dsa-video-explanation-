class Trie {
    unordered_set<string> words, prefixes;
public:
    Trie() {}

    void insert(string word) {
        words.insert(word);
        for (size_t i = 1; i <= word.size(); i++) prefixes.insert(word.substr(0, i));   // O(L²)
    }

    bool search(string word) { return words.count(word) > 0; }

    bool startsWith(string prefix) { return prefixes.count(prefix) > 0; }
};
