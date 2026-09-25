class Solution {
public:
    int kthGrammar(int n, int k) {
        string row = "0";
        for (int r = 1; r < n; r++) {
            string next;
            next.reserve(row.size() * 2);
            for (char c : row) next += (c == '0') ? "01" : "10";
            row = next;
        }
        return row[k - 1] - '0';
    }
};
