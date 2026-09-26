class Solution {
public:
    int characterReplacement(string s, int k) {
        int count[26] = {0}, l = 0, maxf = 0, best = 0;
        for (int r = 0; r < (int)s.size(); r++) {
            maxf = max(maxf, ++count[s[r] - 'A']);
            while (r - l + 1 - maxf > k) count[s[l++] - 'A']--;   // too many changes needed
            best = max(best, r - l + 1);
        }
        return best;
    }
};
