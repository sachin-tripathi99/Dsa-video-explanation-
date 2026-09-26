class Solution {
public:
    bool validPalindrome(string s) {
        int l = 0, r = (int)s.size() - 1;
        while (l < r) {
            if (s[l] != s[r]) return isPal(s, l + 1, r) || isPal(s, l, r - 1);   // delete one side or the other
            l++;
            r--;
        }
        return true;
    }
private:
    bool isPal(const string& s, int l, int r) {
        while (l < r) if (s[l++] != s[r--]) return false;
        return true;
    }
};
