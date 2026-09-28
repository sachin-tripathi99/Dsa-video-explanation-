class Solution {
public:
    int longestStrChain(vector<string>& words) {
        sort(words.begin(), words.end(), [](auto& a, auto& b) { return a.size() < b.size(); });   // predecessors first
        unordered_map<string, int> best;
        int ans = 0;
        for (auto& w : words) {
            int b = 1;
            for (int i = 0; i < (int)w.size(); i++) {
                string prev = w.substr(0, i) + w.substr(i + 1);   // delete one letter
                auto it = best.find(prev);
                if (it != best.end()) b = max(b, it->second + 1);
            }
            best[w] = b;
            ans = max(ans, b);
        }
        return ans;
    }
};
