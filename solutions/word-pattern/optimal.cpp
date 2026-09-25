class Solution {
public:
    bool wordPattern(string pattern, string s) {
        vector<string> words;
        stringstream ss(s);
        string x;
        while (ss >> x) words.push_back(x);
        if (words.size() != pattern.size()) return false;
        unordered_map<char, string> pw;
        unordered_map<string, char> wp;
        for (size_t i = 0; i < words.size(); i++) {
            char c = pattern[i];
            const string& w = words[i];
            if (pw.count(c) && pw[c] != w) return false;
            if (wp.count(w) && wp[w] != c) return false;
            pw[c] = w;
            wp[w] = c;
        }
        return true;
    }
};
