class Solution {
    unordered_set<string> words;
    int grow(const string& w) {                             // longest chain starting at w
        int best = 1;
        for (int i = 0; i <= (int)w.size(); i++)
            for (char c = 'a'; c <= 'z'; c++) {
                string nxt = w.substr(0, i) + c + w.substr(i);
                if (words.count(nxt)) best = max(best, 1 + grow(nxt));
            }
        return best;
    }
public:
    int longestStrChain(vector<string>& ws) {
        words = unordered_set<string>(ws.begin(), ws.end());
        int best = 0;
        for (auto& w : ws) best = max(best, grow(w));       // start anywhere
        return best;
    }
};
