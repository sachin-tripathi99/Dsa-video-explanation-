class Solution {
    int paths(int r, int c) {
        if (r == 0 || c == 0) return 1;                     // along an edge
        return paths(r - 1, c) + paths(r, c - 1);           // from above + from the left
    }
public:
    int uniquePaths(int m, int n) {
        return paths(m - 1, n - 1);
    }
};
