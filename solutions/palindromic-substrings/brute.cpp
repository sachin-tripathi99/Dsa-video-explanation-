class Solution {
public:
    int countSubstrings(string s) {
        int count = 0, n = s.size();
        for (int i = 0; i < n; i++)
            for (int j = i; j < n; j++) {
                int l = i, r = j;
                while (l < r && s[l] == s[r]) { l++; r--; }
                if (l >= r) count++;                        // s[i..j] is a palindrome
            }
        return count;
    }
};
