class Solution {
public:
    int maxVowels(string s, int k) {
        auto isV = [](char c) { return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u'; };
        int best = 0;
        for (size_t i = 0; i + k <= s.size(); i++) {
            int c = 0;
            for (size_t j = i; j < i + k; j++) c += isV(s[j]);
            best = max(best, c);
        }
        return best;
    }
};
