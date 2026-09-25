class Solution {
    bool valid(TreeNode* n, long long low, long long high) {
        if (!n) return true;
        if (n->val <= low || n->val >= high) return false;          // outside the allowed range
        return valid(n->left, low, n->val) && valid(n->right, n->val, high);
    }
public:
    bool isValidBST(TreeNode* root) {
        return valid(root, LLONG_MIN, LLONG_MAX);
    }
};
