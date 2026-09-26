class Solution {
public:
    int kthSmallest(vector<vector<int>>& matrix, int k) {
        int n = matrix.size();
        long long lo = matrix[0][0], hi = matrix[n - 1][n - 1];
        while (lo < hi) {
            long long mid = lo + (hi - lo) / 2;
            if (mid * 2 > lo + hi) mid--;                    // floor for negatives
            int r = n - 1, c = 0, cnt = 0;                   // staircase from the bottom-left
            while (r >= 0 && c < n) {
                if (matrix[r][c] <= mid) { cnt += r + 1; c++; }
                else r--;
            }
            if (cnt >= k) hi = mid;
            else lo = mid + 1;
        }
        return (int)lo;
    }
};
