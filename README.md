# Kurswahl-Helfer

*An English-language version of this readme can be found further down the page.*
___
## Was ist der Kurswahl-Helfer?

Der Kurswahl-Helfer wurde entwickelt, um Probleme des Zuteilungsalgorithmus' im IServ-Kurswahlmodul zu umgehen. Er bietet die Möglichkeit den exportierten Datensatz als `.csv`-Datei zu laden und führt darauf basierend seinen eigenen Kurswahl-Algorithmus aus.

## Welcher Kurswahl-Algorithmus wird verwendet?

**Brute Force.** Ja, der Kurswahl-Helfer berechnet sämtliche Zuteilungsmöglichkeiten für alle möglichen Kursgrößen für alle Teilnehmer, deren Erstwahlen einen Kurs nicht in angemessenem (Minimalgröße $\leq$ Anzahl Erstwahlen $\geq$ Maximalgröße) auffüllen. Dadurch kann der Kurswahl-Helfer allerdings in manchen Fällen auch mehrere Zuteilungen nach unterschiedlichen Kriterien anbieten:
* Die größte Anzahl erfüllter Erstwünsche, Zweitwünsche, usw. (**am meisten beste Zuteilung**)
* Die geringste Anzahl an Personen mit keinem erfüllten Wunsch, erfüllten n-1 Wünschen, n-2 Wünschen, usw. (**am wenigsten schlechte Zuteilung**)
* Der geringste Durschnitt von n<sub>i</sub> mit n<sub>i</sub>$\widehat{=}$ n-ter Wunsch für den i-ten Teilnehmer erfüllt (**bester Durchschnitt**)

___

## What is Kurswahl-Helfer (course selection assistant)?

Kurswahl-Helfer has been developed to circumvent issues with the assignment algorithm of the IServ module "Course Selection". It allows the user to load the exported `.csv`-file and runs its own algorithm to assign people to their courses.

## Which algorithm does it use?

**Brute Force.** Yes, Kurswahl-Helfer calculates every assignment for all possible course sizes and all people, whose first choices can't fill a course to a satisfactory level (minimum size $\leq$ number of first choices $\geq$ maximum size). In return, this enables Kurswahl-Helfer to offer multiple possible assignments under some circumstances, allowing the user to choose between different definitions of a good assignment:
* The largest number of first choices, second choices, etc. (**the most best assignment**)
* The lowest number of people without any fulfilled wishes, fulfilled n-1<sup>st</sup> wishes, n-2<sup>nd</sup> wishes, etc. (**the least bad assignment**)
* The lowest average of n<sub>i</sub> with n<sub>i</sub>$\widehat{=}$ wish n granted to person i (**best average**)