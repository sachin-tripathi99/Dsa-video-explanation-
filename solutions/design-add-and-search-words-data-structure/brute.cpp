class WordDictionary {
    vector<string> words;
public:
    WordDictionary() {}

    void addWord(string word) { words.push_back(word); }

    bool search(string p) {
        for (auto& w : words) {
            if (w.size() != p.size()) continue;
            bool ok = true;
            for (size_t i = 0; i < p.size() && ok; i++)
                if (p[i] != '.' && p[i] != w[i]) ok = false;
            if (ok) return true;
        }
        return false;
    }
};
