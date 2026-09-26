class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_set<char> window;
        int l = 0, best = 0;
        for (int r = 0; r < (int)s.size(); r++) {
            while (window.count(s[r])) window.erase(s[l++]);
            window.insert(s[r]);
            best = max(best, r - l + 1);
        }
        return best;
    }
};
