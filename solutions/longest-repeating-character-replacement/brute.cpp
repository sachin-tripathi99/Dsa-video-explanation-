class Solution {
public:
    int characterReplacement(string s, int k) {
        int best = 0, n = s.size();
        for (int i = 0; i < n; i++) {
            int count[26] = {0}, maxf = 0;
            for (int j = i; j < n; j++) {
                maxf = max(maxf, ++count[s[j] - 'A']);
                if (j - i + 1 - maxf <= k) best = max(best, j - i + 1);
            }
        }
        return best;
    }
};
