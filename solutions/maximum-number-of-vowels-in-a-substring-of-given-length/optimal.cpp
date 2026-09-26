class Solution {
public:
    int maxVowels(string s, int k) {
        auto isV = [](char c) { return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u'; };
        int count = 0, best = 0;
        for (int r = 0; r < (int)s.size(); r++) {
            count += isV(s[r]);                        // one in
            if (r >= k) count -= isV(s[r - k]);        // one out
            if (r >= k - 1) best = max(best, count);
        }
        return best;
    }
};
