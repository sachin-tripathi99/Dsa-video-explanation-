class Solution {
public:
    string reverseWords(string s) {
        int w = 0;                                 // compact: single spaces, none at the ends
        for (int i = 0; i < (int)s.size(); i++) {
            if (s[i] != ' ') {
                if (w > 0 && s[i - 1] == ' ') s[w++] = ' ';
                s[w++] = s[i];
            }
        }
        s.resize(w);
        reverse(s.begin(), s.end());               // reverse everything
        for (int start = 0, i = 0; i <= (int)s.size(); i++) {
            if (i == (int)s.size() || s[i] == ' ') {
                reverse(s.begin() + start, s.begin() + i);   // reverse each word back
                start = i + 1;
            }
        }
        return s;
    }
};
