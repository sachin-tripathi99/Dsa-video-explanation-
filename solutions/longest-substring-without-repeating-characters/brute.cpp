class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int best = 0, n = s.size();
        for (int i = 0; i < n; i++) {
            unordered_set<char> seen;
            for (int j = i; j < n; j++) {
                if (!seen.insert(s[j]).second) break;
                best = max(best, j - i + 1);
            }
        }
        return best;
    }
};
