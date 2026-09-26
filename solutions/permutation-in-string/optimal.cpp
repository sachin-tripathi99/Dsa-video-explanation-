class Solution {
public:
    bool checkInclusion(string s1, string s2) {
        int k = s1.size(), n = s2.size();
        if (k > n) return false;
        array<int, 26> need{}, have{};
        for (char c : s1) need[c - 'a']++;
        for (int r = 0; r < n; r++) {
            have[s2[r] - 'a']++;                       // one in
            if (r >= k) have[s2[r - k] - 'a']--;       // one out
            if (r >= k - 1 && have == need) return true;
        }
        return false;
    }
};
