class Solution {
    int best = 0;
    pair<int, int> solve(TreeNode* node) {                  // {start going left, start going right}
        if (!node) return {-1, -1};
        auto l = solve(node->left), r = solve(node->right);
        pair<int, int> res = {1 + l.second, 1 + r.first};  // the child must turn next
        best = max({best, res.first, res.second});
        return res;
    }
public:
    int longestZigZag(TreeNode* root) {
        solve(root);
        return best;
    }
};
