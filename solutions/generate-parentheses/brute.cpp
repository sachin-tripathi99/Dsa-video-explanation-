class Solution {
public:
    vector<string> generateParenthesis(int n) {
        vector<string> out;
        for (int mask = 0; mask < (1 << 2 * n); mask++) {
            string s;
            int bal = 0;
            bool ok = true;
            for (int i = 0; i < 2 * n; i++) {
                bool open = mask >> i & 1;
                s += open ? '(' : ')';
                bal += open ? 1 : -1;
                if (bal < 0) ok = false;
            }
            if (ok && bal == 0) out.push_back(s);           // balanced
        }
        return out;
    }
};
