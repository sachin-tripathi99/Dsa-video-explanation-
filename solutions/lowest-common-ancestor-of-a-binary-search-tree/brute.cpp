class Solution {
    vector<TreeNode*> path(TreeNode* root, TreeNode* target) {
        vector<TreeNode*> out;
        TreeNode* n = root;
        while (n) {
            out.push_back(n);
            if (n == target) break;
            n = target->val < n->val ? n->left : n->right;
        }
        return out;
    }
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        auto a = path(root, p), b = path(root, q);
        TreeNode* lca = root;
        for (size_t i = 0; i < min(a.size(), b.size()) && a[i] == b[i]; i++) lca = a[i];
        return lca;
    }
};
