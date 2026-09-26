class Solution {
public:
    string minWindow(string s, string t) {
        int need[128] = {0};
        for (char c : t) need[(int)c]++;
        int missing = t.size(), l = 0, bestL = 0, bestLen = INT_MAX;
        for (int r = 0; r < (int)s.size(); r++) {
            if (need[(int)s[r]]-- > 0) missing--;           // a character we still owed
            while (missing == 0) {                          // window covers t
                if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestL = l; }
                if (++need[(int)s[l++]] > 0) missing++;     // dropped a required character
            }
        }
        return bestLen == INT_MAX ? "" : s.substr(bestL, bestLen);
    }
};
