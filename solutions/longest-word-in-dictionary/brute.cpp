class Solution {
public:
    string longestWord(vector<string>& words) {
        unordered_set<string> s(words.begin(), words.end());
        string best;
        for (auto& w : words) {
            bool ok = true;
            for (int i = 1; i < (int)w.size() && ok; i++) ok = s.count(w.substr(0, i));   // every prefix
            if (ok && (w.size() > best.size() || (w.size() == best.size() && w < best))) best = w;
        }
        return best;
    }
};
