class Solution {
public:
    vector<int> findAnagrams(string s, string p) {
        vector<int> out;
        int k = p.size(), n = s.size();
        if (k > n) return out;
        int diff[26] = {0};                       // window count − p count, per letter
        for (char c : p) diff[c - 'a']--;
        int matches = 0;
        for (int d : diff) matches += d == 0;
        auto change = [&](int c, int delta) {
            matches -= diff[c] == 0;
            diff[c] += delta;
            matches += diff[c] == 0;
        };
        for (int r = 0; r < n; r++) {
            change(s[r] - 'a', 1);
            if (r >= k) change(s[r - k] - 'a', -1);
            if (r >= k - 1 && matches == 26) out.push_back(r - k + 1);
        }
        return out;
    }
};
