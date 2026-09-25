class Solution {
public:
    int lengthOfLastWord(string s) {
        int i = (int)s.size() - 1;
        while (i >= 0 && s[i] == ' ') i--;                 // skip trailing spaces
        int length = 0;
        while (i >= 0 && s[i] != ' ') { length++; i--; }
        return length;
    }
};
