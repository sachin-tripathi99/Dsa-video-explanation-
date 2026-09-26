class Solution {
    void pre(TreeNode* n, vector<TreeNode*>& out) {
        if (!n) return;
        out.push_back(n);
        pre(n->left, out);
        pre(n->right, out);
    }
public:
    void flatten(TreeNode* root) {
        vector<TreeNode*> nodes;
        pre(root, nodes);
        for (size_t i = 0; i < nodes.size(); i++) {
            nodes[i]->left = nullptr;
            nodes[i]->right = i + 1 < nodes.size() ? nodes[i + 1] : nullptr;
        }
    }
};
