class Solution {
    pair<int, int> solve(TreeNode* node) {                  // {rob, skip}
        if (!node) return {0, 0};
        auto [lr, ls] = solve(node->left);
        auto [rr, rs] = solve(node->right);
        return {node->val + ls + rs, max(lr, ls) + max(rr, rs)};
    }
public:
    int rob(TreeNode* root) {
        auto [a, b] = solve(root);
        return max(a, b);
    }
};
