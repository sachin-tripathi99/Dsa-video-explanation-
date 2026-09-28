class Solution:
    def replaceWords(self, dictionary: List[str], sentence: str) -> str:
        roots = set(dictionary)
        out = []
        for w in sentence.split():
            rep = w
            for i in range(1, len(w) + 1):      # shortest prefix first
                if w[:i] in roots:
                    rep = w[:i]
                    break
            out.append(rep)
        return " ".join(out)
