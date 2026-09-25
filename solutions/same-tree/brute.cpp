class Solution {
    void ser(TreeNode* n, string& s) {
        if (!n) { s += "#,"; return; }
        s += to_string(n->val) + ",";
        ser(n->left, s);
        ser(n->right, s);
    }
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        string a, b;
        ser(p, a);
        ser(q, b);
        return a == b;
    }
};
