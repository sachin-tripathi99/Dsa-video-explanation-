class Solution {
public:
    bool isPalindrome(string s) {
        string t;
        for (char c : s)
            if (isalnum((unsigned char)c)) t += tolower((unsigned char)c);
        return t == string(t.rbegin(), t.rend());
    }
};
