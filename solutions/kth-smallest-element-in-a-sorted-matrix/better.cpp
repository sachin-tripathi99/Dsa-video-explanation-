class Solution {
public:
    int kthSmallest(vector<vector<int>>& matrix, int k) {
        int n = matrix.size();
        priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>> heap;   // (value, row, col)
        for (int r = 0; r < n; r++) heap.push({matrix[r][0], r, 0});
        for (int t = 1; t < k; t++) {
            auto [x, r, c] = heap.top(); heap.pop();
            if (c + 1 < n) heap.push({matrix[r][c + 1], r, c + 1});   // next in the same row
        }
        return get<0>(heap.top());
    }
};
