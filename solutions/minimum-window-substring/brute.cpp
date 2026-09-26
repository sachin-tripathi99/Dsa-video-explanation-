class Solution {
public:
    string minWindow(string s, string t) {
        int need[128] = {0};
        for (char c : t) need[(int)c]++;
        string best;
        for (size_t i = 0; i < s.size(); i++) {
            int have[128] = {0};
            for (size_t j = i; j < s.size(); j++) {
                have[(int)s[j]]++;
                bool ok = true;
                for (int c = 0; c < 128 && ok; c++) if (have[c] < need[c]) ok = false;
                if (ok) {
                    if (best.empty() || j - i + 1 < best.size()) best = s.substr(i, j - i + 1);
                    break;
                }
            }
        }
        return best;
    }
};
