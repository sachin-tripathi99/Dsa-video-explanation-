class Solution {
public:
    bool validPalindrome(string s) {
        if (isPal(s)) return true;
        for (size_t i = 0; i < s.size(); i++)
            if (isPal(s.substr(0, i) + s.substr(i + 1))) return true;
        return false;
    }
private:
    bool isPal(const string& t) {
        for (int l = 0, r = (int)t.size() - 1; l < r; l++, r--)
            if (t[l] != t[r]) return false;
        return true;
    }
};
