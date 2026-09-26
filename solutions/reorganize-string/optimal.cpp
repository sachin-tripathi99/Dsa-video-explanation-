class Solution {
public:
    string reorganizeString(string s) {
        int n = s.size(), cnt[26] = {0};
        for (char c : s) cnt[c - 'a']++;
        int top = max_element(cnt, cnt + 26) - cnt;
        if (cnt[top] > (n + 1) / 2) return "";              // cannot fit on even slots
        string out(n, ' ');
        int i = 0;
        while (cnt[top]-- > 0) { out[i] = 'a' + top; i += 2; }   // most frequent on evens
        cnt[top] = 0;
        for (int c = 0; c < 26; c++)
            while (cnt[c]-- > 0) {
                if (i >= n) i = 1;                          // wrap to odd slots
                out[i] = 'a' + c;
                i += 2;
            }
        return out;
    }
};
