class Solution {
    int h(TreeNode* n) {                                    // height, or -1 if unbalanced below
        if (!n) return 0;
        int a = h(n->left);
        if (a == -1) return -1;
        int b = h(n->right);
        if (b == -1 || abs(a - b) > 1) return -1;
        return 1 + max(a, b);
    }
public:
    bool isBalanced(TreeNode* root) {
        return h(root) != -1;
    }
};
